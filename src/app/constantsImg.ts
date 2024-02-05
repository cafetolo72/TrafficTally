export interface DataImg{
    uuid: string,
    name: string,
    image: string
}

export const avatar ={ uuid: '0', name: 'avatar', image: 'assets/images/kisspng-avatar.png'};
export const graduation ={uuid: '1', name: 'graduation', image: 'assets/images/graduation.png'};
export const happyFace ={ uuid: '2', name: 'happy face', image: 'assets/images/happy-face.png'};
export const profileAvatar ={ uuid: '3', name: 'profileAvatar', image: 'assets/images/Profile-Avatar.png'};
export const userAvatar ={ uuid: '4', name: 'userAvatar', image: 'assets/images/User-Avatar.png'};
export const glasses ={ uuid: '5', name: 'glasses', image: 'assets/images/transparent-glasses.png'};
export const penguin ={ uuid: '6', name: 'penguin', image: 'assets/images/penguin.png'};
export const question ={uuid: '7', name: 'question', image: 'assets/images/question.png'};

export const ArrayImg : Array<DataImg> = [ avatar, graduation, happyFace, profileAvatar, userAvatar, glasses, penguin];
