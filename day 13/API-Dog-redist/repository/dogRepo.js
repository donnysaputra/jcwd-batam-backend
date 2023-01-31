const { default: axios } = require("axios");

const DogRepository = {
  image: async () => {
    try {
      const data = await axios.get(`https://dog.ceo/api/breed/hound/list`);
      return data.data.message.hound;
    } catch (err) {
      throw err;
    }
  },
  dog_images: async (dogs) => {
    try {
      const data = await axios.get(`https://dog.ceo/api/breed/${dogs}/images`);

      return data.data.message;
    } catch (err) {
      throw err;
    }
  },
};
module.exports = DogRepository;
