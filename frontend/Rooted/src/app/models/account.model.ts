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
    myPhotos: string[];
   

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
        this.myPhotos = response.myPhotos;
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
      
    }
}
