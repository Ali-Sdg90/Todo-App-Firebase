console.log("Hello");

// Shows we are connected to server

document.addEventListener("DOMContentLoaded", (event) => {
    const app = firebase.app();
    console.log(app);
});

// Auth with google

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            document.write(`Hello ${user.displayName}`);
            console.log(user);
        })
        .catch(console.log);
}

// Get data

// document.addEventListener("DOMContentLoaded", (event) => {
//     const app = firebase.app();
//     const db = firebase.firestore();
//     const myPost = db.collection("Todos").doc("todos-data");
//     myPost.get().then((doc) => {
//         const data = doc.data();
//         //   document.write( data.title + '<br>')
//         //   document.write( data.createdAt )
//         console.log(data);
//     });
// });

// Get realtime data with each snapshot!

document.addEventListener("DOMContentLoaded", (event) => {
    const app = firebase.app();
    const db = firebase.firestore();
    const myPost = db.collection("Todos").doc("todos-data");

    myPost.onSnapshot((doc) => {
        const data = doc.data();

        // console.log(data.dataArray);
        console.log(data.dataArray);
    });
});

// Write data to server

function updatePost(e) {
    const db = firebase.firestore();
    const myPost = db.collection("Todos").doc("todos-data");
    myPost.update({ text: e.target.value });
}
