// https://freecodez.com
const ConfettiButton = (props) => {
  const handleClick = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 60,
    });
  };
  return (
    <div>
      <button onClick={handleClick}>{props.txt}</button>
    </div>
  );
};
function confetti(arg0: { particleCount: number; spread: number }) {
  throw new Error("Function not implemented.");
}
