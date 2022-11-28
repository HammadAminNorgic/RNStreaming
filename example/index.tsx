import { AppRegistry } from 'react-native';
import App from './src/App';
import notifee  from '@notifee/react-native';
notifee.registerForegroundService( notification => {
	return new Promise( () => {

	} );
} );
AppRegistry.registerComponent('main', () => App);
