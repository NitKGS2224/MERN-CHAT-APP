

const RightSidebar = ({ selectedUser }) => {
  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
          selectedUser ? 'max-md:hidden' : ''
        }`}
      >
       
        <button className=" absolute bottom-5  left-1/2 transform -translate-x-1/2 bg-violet-600 text-white border-none  text-sm font-light py-2 px-20 rounded-full cursor-pointer">
        Logout

        </button>
      </div>

    )
  );
};

export default RightSidebar;
