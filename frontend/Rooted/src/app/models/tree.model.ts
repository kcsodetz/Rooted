export class Tree{

    founder: string;
    members: string;
    treeName: string;
    dateCreated: string;
    numberOfPeople: Number;
    chat: [{
        user: string,
        message: string,
    }];
    imageUrl: string;
    ID: string;
    description: string;
    admins: [String];
    privateStatus: Boolean;
    bannedUsers: [String];
    aboutBio: string;
    memberRequestedUsers: [String];
    pendingUsers: [String];
    colorScheme: [String];
    nonRootedMembers:  [{
        id: number,
        name: string,
        email: string,
        yearJoined: number,
        approved: Boolean
    }];
    memberInvolvement: [{
        user: String,
        yearStarted: number,
        yearEnded: number
    }]
    
    
    constructor(response: any) {
        this.ID = response._id;
        this.founder = response.founder;
        this.members = response.members;
        this.treeName = response.treeName;
        this.dateCreated = response.dateCreated;
        this.numberOfPeople = response.numberOfPeople;
        this.chat = response.chat;
        this.imageUrl = response.imageUrl;
        this.description = response.description;
        this.admins = response.admins;
        this.privateStatus = response.privateStatus;
        this.bannedUsers = response.bannedUsers;
        this.aboutBio = response.aboutBio;
        this.memberRequestedUsers=response.memberRequestedUsers;
        this.pendingUsers=response.pendingUsers;
        this.colorScheme=response.colorScheme;
        this.nonRootedMembers=response.nonRootedMembers;
        this.memberInvolvement = response.memberInvolvement;
    }
}