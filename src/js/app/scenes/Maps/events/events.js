export default class Event {

  constructor( name ) {
    this.name(name);
  }

  name(t) {
    console.log(`%c Event name ${t} attached`, 'background: #690; color: #eee');
  }

}
