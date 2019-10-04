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
     /*   this.birthYear=response.birthYear.properties.value;
        this.phoneNumber=response.phoneNumber.properties.value;
        this.facebook=response.facebook.properties.value;
        this.instagram=response.instagram.properties.value;
        this.twitter=response.twitter.properties.value;

        this.birthYearHidden=response.birthYear.properties.hidden;
        this.emailHidden=response.email.properties.hidden;
        this.phoneNumberHidden=response.phoneNumber.properties.hidden;
        this.facebookHidden=response.facebook.properties.hidden;
        this.instagramHidden=response.instagram.properties.hidden;
        this.twitterHidden=response.twitter.properties.hidden;*/
      
    };
    
}
