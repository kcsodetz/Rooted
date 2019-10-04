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
        this.birthYearHidden=false;
        this.emailHidden=false;
        this.phoneNumberHidden=false;
        this.facebookHidden=false;
        this.instagramHidden=false;
        this.twitterHidden=false;
        if(response.birthYearHidden==true)
        {
            this.birthYearHidden=true;
        }
        
        if(response.emailHidden==true)
        {
            this.emailHidden=true;
        }
       
        if(response.phoneNumberHidden==true)
        {
            this.phoneNumberHidden=true;
        }
       
        if(response.facebookHidden==true)
        {
            this.facebookHidden=true;
        }
        
        if(response.instagramHidden==true)
        {
            this.instagramHidden=true;
        }
        
        if(response.twitterHidden==true)
        {
            this.twitterHidden=true;
        }
      
    }
}
