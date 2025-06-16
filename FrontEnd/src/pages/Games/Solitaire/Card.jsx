const Card = ({ card, isFaceDown }) => {


 
 
  return (
    <img
      src={isFaceDown ? card.backImage : card.image}
      alt={isFaceDown ? 'Card back' : `${card.value} of ${card.suit}`}
      className="card-image"
    />
  );
};

export default Card;

