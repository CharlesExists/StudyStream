export const exampleUser_Charles = {

// example user charles

    uid: "uid_cda8712",
    email: "cda8712@example.com",
    name: "Charles Ampah",
    bio: "Computer science student exploring algorithms and data structures. loves shake shack",
    xp: 1240,
    level: 5,
    unlockedItems: ["sail_blue", "sail_orange"],
  


    boards: {
      board_data_structures: {
        title: "Data Structures Overview",
        description: "Notes and diagrams on linked lists, stacks, queues, and trees.",
        content: "string",
        createdAt: "2025-10-23T15:00:00Z",
        timeSpent: 320 // time in minutes
      }
    },
  
    flashcards: {


      set_data_structures_basics: { // the set for DS
        name: "Data Structures Basics",
        description: "key words my teacher wont teach me",
        createdAt:  "2025-10-23T15:30:00Z",
        cards: {
          card_1: {
            question: "What is a stack?",
            answer: "a data structure thats meant to store things, uses the property first in last out ",
            createdAt: "2025-10-23T15:31:00Z"
          },
          card_2: {
            question: "Difference between array and linked list?",
            answer: "Arrays have fixed size and contiguous memory, and linked lists are dynamic and use nodes.",
            createdAt: "2025-10-23T15:32:00Z"
          }
        }
      }
    },
  
    friends: {
      uid_rob12: {
        name: "Tasnia",
        bio: "Sophmore Student",
        email: "rtfr9403@nyu.edu",
        accountLevel: 15,
        addedAt: "2025-10-20T10:45:00Z"
      },
      uid_jane77: {
        name: "Andrew",
        bio: "Freshmen student",
        email: "acl10180@nyu.edu",
        accountLevel: 8,
        addedAt: "2025-10-21T12:20:00Z"
      }
    }
  };