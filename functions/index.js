const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.newRequest = functions.https.onRequest((req, res) => {
  const ip = req.ip;
  const { prompt, boardId } = req.body;

  const docData = {
    ip: ip,
    prompt: prompt,
    boardId: boardId,
  };

  functions.logger.info('newRequest', {
    ip,
    prompt,
  });

  admin
    .firestore()
    .collection('requests')
    .add(docData)
    .then((docRef) => {
      res.status(200).json({
        message: 'Document added successfully',
        documentId: docRef.id,
      });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
      res.status(500).send('Error adding document');
    });
});
