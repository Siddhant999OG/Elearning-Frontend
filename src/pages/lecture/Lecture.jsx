import React, { useEffect, useState } from "react";
import "./Lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      user.role !== "admin" &&
      !user.subscription.includes(params.id)
    ) {
      navigate("/");
    }
  }, [user, params.id, navigate]);

  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/v1/fetchLectures/${params.id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setLectures(data?.lectures || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecture = async (id) => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(
        `${server}/api/v1/fetchSingleLecture/${id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setLecture(data?.lecture || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLecLoading(false);
    }
  };

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setbtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/lecture/${params.id}`,
        myForm,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      toast.success(data.message);
      fetchLectures();
      setShow(false);
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setbtnLoading(false);
    }
  };

  const deleteHandler = async(id) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(`${server}/api/v1/deletelecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchLectures();
  }, [params.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="lecture-page">
          <div className="left">
            {lecLoading ? (
              <Loading />
            ) : lecture?.video ? (
              <div>
                <video
                  src={`${server}/${lecture.video}`}
                  width="100%"
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                />
                <h1>{lecture.title}</h1>
                <h3>{lecture.description}</h3>
              </div>
            ) : (
              <h1>Please select a lecture</h1>
            )}
          </div>

          <div className="right">
            {user?.role === "admin" && (
              <button
                className="common-btn"
                onClick={() => setShow(!show)}
              >
                {show ? "Close" : "Add Lecture +"}
              </button>
            )}

            {show && (
              <div className="lecture-form">
                <h2>Add Lecture</h2>
                <form onSubmit={submitHandler}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="title"
                    required
                  />

                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    required
                  />

                  <label htmlFor="video">Video</label>
                  <input
                    type="file"
                    onChange={changeVideoHandler}
                    id="video"
                    accept="video/*"
                    required
                  />

                  {videoPrev && (
                    <video
                      src={videoPrev}
                      width={300}
                      controls
                    />
                  )}

                  <button
                    type="submit"
                    className="common-btn"
                    disabled={btnLoading}
                  >
                    {btnLoading ? "Please Wait..." : "Add"}
                  </button>
                </form>
              </div>
            )}

            {lectures.length > 0 ? (
              lectures.map((e, i) => (
                <div key={e._id} className="lecture-item">
                  <div
                    onClick={() => fetchLecture(e._id)}
                    className={`lecture-number ${
                      lecture._id === e._id ? "active" : ""
                    }`}
                  >
                    {i + 1}. {e.title}
                  </div>
                  {user?.role === "admin" && (
                    <button
                      className="common-btn"
                      style={{ background: "red" }}
                      onClick={()=>deleteHandler(e._id)}
                    >
                      Delete {e.title}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No lectures available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Lecture;