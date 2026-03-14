import React, { useEffect, useState } from 'react';
import {
View,
Text,
StyleSheet,
TouchableOpacity,
PermissionsAndroid,
Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

type Props = NativeStackScreenProps<any, 'MapPicker'>;

export default function MapPickerScreen({ navigation }: Props) {

const [location, setLocation] = useState({
  latitude: 12.9716,
  longitude: 77.5946
});

const [marker, setMarker] = useState(location);

useEffect(() => {
  requestLocation();
}, []);

const requestLocation = async () => {

  if (Platform.OS === 'android') {

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return;
    }
  }

  Geolocation.getCurrentPosition(
    position => {

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setLocation(coords);
      setMarker(coords);

    },
    error => console.log(error),
    { enableHighAccuracy: true }
  );
};

const confirmLocation = () => {

  navigation.navigate("AddAddress", {
    latitude: marker.latitude,
    longitude: marker.longitude
  });

};

return (

<View style={styles.container}>

<MapView
style={styles.map}
initialRegion={{
  latitude: location.latitude,
  longitude: location.longitude,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01
}}
onPress={(e)=>setMarker(e.nativeEvent.coordinate)}
>

<Marker coordinate={marker} />

</MapView>

<View style={styles.bottomCard}>

<Text style={styles.title}>Select Delivery Location</Text>

<Text>
Lat: {marker.latitude.toFixed(5)}
</Text>

<Text>
Lng: {marker.longitude.toFixed(5)}
</Text>

<TouchableOpacity
style={styles.btn}
onPress={confirmLocation}
>

<Text style={styles.btnText}>
Confirm Location
</Text>

</TouchableOpacity>

</View>

</View>

);
}

const styles = StyleSheet.create({

container:{
flex:1
},

map:{
flex:1
},

bottomCard:{
position:"absolute",
bottom:0,
width:"100%",
backgroundColor:"#fff",
padding:20,
borderTopLeftRadius:20,
borderTopRightRadius:20,
elevation:10
},

title:{
fontSize:18,
fontWeight:"600",
marginBottom:10
},

btn:{
marginTop:15,
backgroundColor:"#000",
padding:15,
borderRadius:10,
alignItems:"center"
},

btnText:{
color:"#fff",
fontWeight:"600"
}

});