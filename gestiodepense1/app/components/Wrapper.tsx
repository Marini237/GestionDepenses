import Navbar from "./Navbar";

type WrapperProps = {
    children: React.ReactNode;
}
const Wrapper = ({children} : WrapperProps) => {
  return (
	<div>
	  <Navbar />
      <div className="px-5 md:px-[10%] mt-10 mn-10">
        {children}
      </div>
	</div>
  );
};

export default Wrapper;