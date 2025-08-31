const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "rahulnama08",
  api_key: "175258346426798",
  api_secret: "qQZOeGXrazqYlak43jU1yyIhApg",
});


// exports.uploadFile = async (files) => {
//   const fileArray = Array.isArray(files.images) ? files.images : [files.images]; // handles both single and multiple images
//   const results = [];

//   for (const file of fileArray) {
//     try {
//       const result = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: "hotel_rooms",
//             resource_type: "image",
//           },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve({
//               url: result.secure_url,
//               public_id: result.public_id,
//             });
//           }
//         );

//         stream.end(file.data);
//       });

//       results.push(result);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   }

//   return results;
// };

exports.uploadFile = async (files) => {
  const fileArray = Array.isArray(files) ? files : [files];
  const results = [];

  for (const file of fileArray) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "hotel_rooms",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

        stream.end(file.data);
      });

      results.push(result.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return results;
};


exports.updateFile = async (inputFiles) => {
  const fileArray = Array.isArray(inputFiles) ? inputFiles : [inputFiles]; // normalize to array
  const results = [];

  for (const file of fileArray) {
    try {
      if (!file || !file.data) {
        throw new Error("Invalid file input");
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "hotel_rooms",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

        stream.end(file.data);
      });

      results.push(result);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  }

  return results;
};


exports.uploadProfilePicture = async (imageData, userId) => {
  try {
    // Return null if no image data is provided

    if (!imageData) {
      console.log("No image data provided");
      return null;
    }

    const publicId = `profile_pictures/${userId}`;

    // Use the direct upload method for base64 strings
    const result = await cloudinary.uploader.upload(imageData, {
      public_id: publicId,
      overwrite: true,
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
      ],
    });

    console.log("Upload successful:", result.secure_url);
    return result.secure_url; // Return just the secure URL for storing in the database
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};