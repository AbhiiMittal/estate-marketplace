import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { updateUserStart,updateUserFailure,updateUserSuccess } from "../redux/users/userSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser)
  const currentUserCred = currentUser.validCred;
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  // console.log(filePerc);
  // console.log(currentUser);
  console.log(formData);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);


  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }))
  };

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          default:
            break;
        }
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
        });
      }
    );
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      await fetch(`http://localhost:3000/users/update/${currentUserCred._id}`, {
        method: "POST",
        headers:{
          "Authorization":`Bearer ${currentUser.token}`,
          "Content-Type": "application/json",
      },
        body: JSON.stringify(formData),
    })
    const data = await res.json();
    if(data.success === false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUserCred.avatar}
          alt=""
          className="rounded-full h-24 w-24 object-cover
        cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center ">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Uploading</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Uploaded</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUserCred.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="email"
          defaultValue={currentUserCred.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          className="bg-slate-700 text-white rounded-lg p-3 uppercase
        hover:opacity-95 disabled:opacity-80"
        >
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
