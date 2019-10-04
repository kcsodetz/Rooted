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
        this.email = response.email.properties.value;
        this.birthYear=response.birthYear;
        this.phoneNumber=response.phoneNumber;
        this.facebook=response.facebook;
        this.instagram=response.instagram;
        this.twitter=response.twitter;

        this.birthYearHidden=response.birthYearHidden;
        this.emailHidden=response.emailHidden;
        this.phoneNumberHidden=response.phoneNumberHidden;
        this.facebookHidden=response.facebookHidden;
        this.instagramHidden=response.instagramHidden;
        this.twitterHidden=response.twitterHidden;
      
    };
    
}
