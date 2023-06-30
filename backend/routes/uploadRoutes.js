import path from 'path';
import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .png, .jpg and .jpeg format allowed!');
      err.name = 'ExtensionError';
      return cb(err);
    }
  },
}).array('uploadedImages', 2);
// const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res
        .status(500)
        .send({ error: { message: `Multer uploading error: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      // An unknown error occurred when uploading.
      if (err.name == 'ExtensionError') {
        res
          .status(413)
          .send({ error: { message: err.message } })
          .end();
      } else {
        res
          .status(500)
          .send({
            error: { message: `unknown uploading error: ${err.message}` },
          })
          .end();
      }
      return;
    }

    // Everything went fine.
    // show file `req.files`
    // show body `req.body`
    res.status(200).send({
      message: 'Images uploaded successfully',
      image: `${req.file.path}`,
    });
  });

  // uploadSingleImage(req, res, function (err) {
  //   if (err) {
  //     res.status(400).send({ message: err.message });
  //   }

  //   res.status(200).send({
  //     message: 'Image uploaded successfully',
  //     image: `/${req.file.path}`,
  //   });
  // });
});

// const deleteImage = asyncHandler(async (req, res) => {
//   const expense = await Expense.findById(req.params.id);

//   if (expense) {
//     await Expense.deleteOne({ _id: expense._id });
//     res.json({ message: 'Image deleted' });
//   } else {
//     res.status(404);
//     throw new Error('Image not found');
//   }
// });

const deleteImage = (req, res) => {
  const fileName = req.params.imgName;
  const __dirname = path.resolve();
  const directoryPath = __dirname + '/uploads/';

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).json({
        message: 'Could not delete the Image. ' + err,
      });
    }

    res.status(200).json({
      message: 'Image is deleted.',
    });
  });
};

router.route('/image/:imgName').delete(protect, deleteImage);

export default router;