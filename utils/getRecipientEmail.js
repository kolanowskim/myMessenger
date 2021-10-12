const getRecipientEmail = (users, userLoggedIn) =>
  users?.filter((user) => user !== userLoggedIn.email)[0]; //wyciąga z tablicy

export default getRecipientEmail;
