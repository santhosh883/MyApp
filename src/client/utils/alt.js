import Alt from 'alt';
import AltContainer from 'alt-container';

const thing = typeof window !== 'undefined' ? window : global;

thing.AltContainer = AltContainer;
thing.newAltContext = () => new Alt();
thing.Alt = thing.newAltContext();

export default thing.Alt;
