import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdUser } from './dto/adUser.dto';
import { AdOptions } from './dto/adOptions.dto';

@Injectable()
export class AdService {

    private ad: any;

    constructor(
        private readonly configServiсe: ConfigService,        
    ) {
        const ActiveDirectory = require('activedirectory2').default || require('activedirectory2');

        const config = {
            url: this.configServiсe.get('AD_URL'),
            baseDN: this.configServiсe.get('AD_BASE_DN'),
            username: this.configServiсe.get('AD_USER'),
            password: this.configServiсe.get('AD_PSWD'),
            attributes: {
                user: ['thumbnailPhoto']
            },
            entryParser: (entry, raw, callback) => {
                if (raw.hasOwnProperty('thumbnailPhoto')) {
                    entry.thumbnailPhoto = raw.thumbnailPhoto;
                }
                callback(entry);
            }
        };

        this.ad = new ActiveDirectory(config);
    }

    private escapeLdapSearchValue(str: string): string {
    if (typeof str !== 'string') return '';
    return str
      .replace(/\\/g, '\\5c')
      .replace(/\*/g, '\\2a')
      .replace(/\(/g, '\\28')
      .replace(/\)/g, '\\29')
      .replace(/\0/g, '\\00')
      .replace(/\//g, '\\2f');
  }

    async findOneUser(name: string) {
        const opts: AdOptions = this.getOption(name) || {};

        return this.getAdData(opts);
    }

    async findAllUsers() {
        const opts: AdOptions = this.getOption() || {};

        return  await this.getAdData(opts)
            .then(list => list?.['users'])
            .then(users => users.filter(user => user.mail) )
            .then(users => users.filter(user => !user.wWWHomePage) )
            .then(users => users.sort((a, b) => {
                const nameA = (a.displayName || '').toLowerCase();
                const nameB = (b.displayName || '').toLowerCase();

                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                
                return 0;
            }))
            .then(users => users.map(user => {
                let avatarBase64: string | null = null;
                if (user.thumbnailPhoto) {
                    try {
                        const photoBuffer = Buffer.isBuffer(user.thumbnailPhoto) 
                            ? user.thumbnailPhoto 
                            : Buffer.from(user.thumbnailPhoto, 'binary');
                        avatarBase64 = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`;
                    } catch (e) {
                        avatarBase64 = null;
                    }
                }
                return { ...user, avatarBase64 };
            }))

    }

    private getOption(name?: string) : AdOptions {
        let filter: any;
        if(name) filter = `(&(objectClass=user)(displayName=*${this.escapeLdapSearchValue(name)}*))`
        else filter = '(&(objectClass=user)(!(objectClass=computer))(!(userAccountControl:1.2.840.113556.1.4.803:=2)))'

        return {
            filter,
            scope: 'sub',
            attributes: [
                'sAMAccountName',
                'displayName',
                'mail',
                'telephoneNumber',
                'physicalDeliveryOfficeName',
                'title',
                'department',
                'wWWHomePage',
                'thumbnailPhoto',
            ]};
    }

    private async getAdData(opts: AdOptions): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.ad.find(opts, (err, users) => {
                if (err) {
                    console.error('Ошибка при получении пользователей из AD:', err);
                    return reject(err);
                }
                
                resolve(users || []);
                reject(err)
            });
        });
    }


}
