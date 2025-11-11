export const firestoreStructure = {
     users: {
       uid: {
         email: "string",
         name: "string",
         bio: "string",
         xp: "number",
         level: "number",
         unlockedItems: ["string"],
   
         // each user has its own set of basic info
   
         boards: {
           boardId: {
             title: "string",
             description: "string",
             content: "string",
             createdAt: "timestamp",
             timeSpent: "number" // keep track of time spent
           }
         },
   
         flashcards: {
           setId: {
             name: "string",
             description: "string",
             createdAt: "timestamp",
             cards: {
               cardId: {
                 question: "string",
                 answer: "string",
                 createdAt: "timestamp"
               }
             }
           }
         },
   
         friends: {
           friendUid: {
             name: "string",
             accountLevel: "string",
             addedAt: "timestamp"
           }
         }
       }
     },
   
     items: {
       itemId: {
         name: "string",
         type: "string",
         unlockMinimumLevel: "number",
         description: "string"
       }
     }
   };
   