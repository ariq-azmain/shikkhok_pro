import React from 'react';

interface IPropd {
  params: {
    username: string
  }
}

const ProfilePage = ({params}: IPropd) => {
  const { username } = params;
  return (
    <div>
      first {/* Your JSX code here */}
    </div>
  );
};

export default ProfilePage;