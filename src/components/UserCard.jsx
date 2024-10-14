import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../store/slices/feedSlice";
import { useLocation } from "react-router-dom";

const UserCard = ({ user, onRemoveSkill }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } =
    user;
  const dispatch = useDispatch();

  const path = useLocation();
  const homePath = path.pathname === "/";

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div className="flex justify-center mt-10 md:block md:mt-0">
      <div className="card bg-base-300 w-96 lg:grid lg:col-span-6 shadow-xl">
        <figure>
          <img src={user?.photoUrl} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p>{age + ", " + gender}</p>}
          <p>{about}</p>

          <div className="mt-2 flex flex-wrap">
            {skills.map((skill) => (
              <div key={skill} className="mr-2 mb-2">
                <span className="badge badge-info py-2">{skill}</span>
                <span
                  className="text-sm font-semibold cursor-pointer ml-1"
                  onClick={() => onRemoveSkill(skill)}
                >
                  X
                </span>
              </div>
            ))}
          </div>
          {homePath && (
            <>
              <div className="card-actions justify-center my-4">
                <button
                  className="btn btn-primary"
                  onClick={() => handleSendRequest("ignored", _id)}
                >
                  Ignore
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSendRequest("interested", _id)}
                >
                  Interested
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
