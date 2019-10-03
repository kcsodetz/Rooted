export class Account {
    username: string;
    email: string;
    birthYear: string;
    facebook: string;
    instagram: string;
    twitter: string;
    phoneNumber: string;
    birthYearHidden: boolean;
    emailHidden: boolean;
    facebookHidden: boolean;
    instagramHidden: boolean;
    phoneNumberHidden: boolean;
    twitterHidden: boolean;

    constructor(response: any) {
        this.username = response.username;
        this.email = response.email;
        this.birthYearHidden=false;
        this.birthYearHidden=false;
        this.emailHidden=false;
        this.facebookHidden=false;
        this.instagramHidden=false;
        this.twitterHidden=false;
    }
}
