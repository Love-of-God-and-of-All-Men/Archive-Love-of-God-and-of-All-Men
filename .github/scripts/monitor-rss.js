const admin = require('firebase-admin');
const Parser = require('rss-parser');

// Parse the Firebase configuration string from the GitHub secret
const firebaseConfigString = process.env.FIREBASE_CREDENTIALS;
const firebaseConfig = JSON.parse(`{${firebaseConfigString}}`);

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const db = admin.firestore();
const messaging = admin.messaging();

// Replace this with your RSS feed URL
const rssFeedUrl = 'https://love-of-god-and-of-all-men.github.io/feed.xml';

// Function to check for new items in the RSS feed
async function checkForNewItems() {
  const parser = new Parser();
  const feed = await parser.parseURL(rssFeedUrl);

  // Retrieve the last stored item from Firestore
  const lastItemSnapshot = await db.collection('rssFeed').doc('lastItem').get();
  const lastStoredItem = lastItemSnapshot.data();

  // Check if the feed has a new item
  if (lastStoredItem && feed.items[0].link !== lastStoredItem.link) {
    // Update Firestore with the latest item
    await db.collection('rssFeed').doc('lastItem').set(feed.items[0]);

    // Send a notification
    const message = {
        topic: 'YOUR_TOPIC',
        notification: {
            title: 'New RSS Feed Item',
            body: `Check out the latest content: ${feed.items[0].title}`,
        },
    };

    // Send the notification
    await messaging.send(message);
  }
}

// Execute the function
checkForNewItems().catch(console.error);
