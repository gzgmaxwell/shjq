export function getOnlyUid(file, bucketInfo) {
  let suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
  const time = new Date().getTime();
  const random = Math.floor(Math.random() * 100);
  let comDir = '';
  if (file.type.includes('video')) {
    comDir = bucketInfo.videoDir;
  } else {
    comDir = bucketInfo.pictureDir;
  }
  let str = `${comDir}${time}-${random}.${suffix}`;
  return str;
}

// 上传图片
export function AwsUpdatePicture(file, bucketInfo, instanceAWS, cbProgress) {
  if (file) {
    const uploadParams = {
      Bucket: bucketInfo.bucketName,
      Key: getOnlyUid(file, bucketInfo),
      Body: file,
    };
    return new Promise(function (resolve) {
      const upload = instanceAWS
        .upload(uploadParams, function (err, data) {
          if (err) {
            console.log('Error: ', err);
          } else {
            console.log(' 上传图片 S3 上传成功后的数据==', data);
          }
          resolve(upload);
        })
        .on('httpUploadProgress', event => {
          // var progress = Math.round((event.loaded / event.total) * 100);
          if (typeof cbProgress === 'function') {
            cbProgress(event);
          }
        });
    });
  }
}
