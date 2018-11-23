export interface Links {
    _id :{
        $oid: string    //MongoDBのID
    },
    time : string,  //UNIXTimeStamp
    url: string | undefined,    //Url
    link: [
        string, //readerId
        string  //cardId
        ]
}