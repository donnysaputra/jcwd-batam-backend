const DogRepository = require("../repository/dogRepo");

test("check images husky", async () => {
  const result = await DogRepository.dog_images("hound");
  console.log(result.length);
  expect(result?.length).toBe(183);
});

// test("mock images", async () => {
//   //   DogRepository.image = jest
//   //     .fn()
//   //     .mockReturnValue([
//   //       "afghan",
//   //       "basset",
//   //       "blood",
//   //       "english",
//   //       "ibizan",
//   //       "plott",
//   //       "walker",
//   //     ]);
//   result = await DogRepository.image();
//   console.log(result);
//   expect(result.length).toBe(9);
//   expect(result).toStrictEqual([
//     "afghan",
//     "basset",
//     "blood",
//     "english",
//     "ibizan",
//     "plott",
//     "walker",
//   ]);
// });
