import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import userService from '../services/user-service';
import User from '../interfaces/user';

const ProfileComponent: React.FC<{onUpdateProfile: () => void}> = ({onUpdateProfile}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { user, setUser } = useUserStore();

  const onUpdate = () => {
    if (!fullName.trim() || (fullName === user?.fullName && !profileImage)) {
        setShowEditModal(false);
        return;
    } 

    if (profileImage) {
      const { request } = userService.uploadImage(profileImage);
      request
        .then((response) => {
          const userToUpdate: User = {
            fullName: fullName,
            imageUrl: response.data.url,
          };

          const { request } = userService.updateUser(userToUpdate);
          request
            .then((response) => {
              const updatedUser: User = {
                email: response.data.email,
                fullName: response.data.fullName,
                imageUrl: response.data.imageUrl,
              };
              setUser(updatedUser);
              setShowEditModal(false);
              onUpdateProfile();
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const userToUpdate: User = {
        fullName: fullName,
        imageUrl: user?.imageUrl,
      };

      const { request } = userService.updateUser(userToUpdate);
      request
        .then((response) => {
          const updatedUser: User = {
            email: response.data.email,
            fullName: response.data.fullName,
            imageUrl: response.data.imageUrl,
          };
          setUser(updatedUser);
          setShowEditModal(false);
          onUpdateProfile();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <div className="card" style={{ width: '100%' }}>
        <div className="text-center mb-4 mt-4">
          <img
            src={user?.imageUrl}
            className="rounded-circle"
            height="200"
            width="200"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="container d-flex flex-column justify-content-center align-items-center mb-4">
          <h4>{user?.fullName}</h4>
          <p className="text-secondary">{user?.email}</p>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => {
              setShowEditModal(true);
              setFullName(user?.fullName ?? '');
              setProfileImage(null);
            }}
          >
            update profile
          </button>
        </div>
      </div>

      {showEditModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4 mt-4">
                <label htmlFor="profilePicture" className="d-block" style={{ cursor: 'pointer' }}>
                  <img
                    src={profileImage ? URL.createObjectURL(profileImage) : user?.imageUrl}
                    className="rounded-circle"
                    height="200"
                    width="200"
                    style={{ objectFit: 'cover' }}
                  />
                  </label>
                  <input
                    id="profilePicture"
                    type="file"
                    className="form-control mb-2 d-none"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={!fullName.trim()}
                  className="btn btn-primary"
                  onClick={() => {
                    onUpdate();
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileComponent;
