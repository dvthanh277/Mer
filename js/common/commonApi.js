class CommonApi {
  getData = async (endpoint) => {
    try {
      const res = await database
        .ref(endpoint)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            return null;
          }
        });
      return res;
    } catch (error) {
      return null;
    }
  };
}
const API = new CommonApi();
