import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
// import SignUp from './signUp';
import QRCodeStyled from 'react-native-qrcode-styled';

import { Link, useRouter } from 'expo-router';



type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

interface UserData {
  firstName: string;
  lastName: string;
  mobile: string;
  phone: string;
  email: string;
  company: string;
  Title: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  website: string;
}

const HomeScreen: React.FC<Props> = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const router = useRouter();

  console.log('Navigation prop:', navigation);
  const [qrValue, setQRValue] = useState('');
  const [isQRVisible, setIsQRVisible] = useState(false);
  const qrCodeRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const loadDetails = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data !== null) {
        const userData: UserData = JSON.parse(data);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        generateQRCode(userData);
      }
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const generateQRCode = (userData: UserData) => {
    if (userData.firstName && userData.lastName) {
      const vCard = `
BEGIN:VCARD
VERSION:3.0
N:${userData.lastName};${userData.firstName};;;
FN:${userData.firstName} ${userData.lastName}
EMAIL:${userData.email}
ORG:${userData.company}
TEL:${userData.mobile}
TITLE:${userData.Title}
ADR:;;${userData.address1};${userData.city};${userData.state};${userData.zip};${userData.country}
URL:${userData.website}
END:VCARD
      `;
      setQRValue(vCard.trim());
      setIsQRVisible(true);
    } else {
      setIsQRVisible(false);
    }
  };

  const shareQRCode = async () => {
    try {
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1.0,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing QR code', error);
      Alert.alert('Error', 'Failed to share QR code.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {isQRVisible && (
          <View style={styles.qrCode} ref={qrCodeRef}>
            {/* <QRCode
              value={qrValue}
              size={200}
              color="black"
              backgroundColor="white"
              logo={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABHVBMVEVHcEwPdbUKc7gGg8d1p3sKgsYNe7wkiL0ViMoTfsDCySsQgcMHcbeLv0U4rcsLcrgKcrcKcbeMv0P4zgT/zwXdxRq/xy7/0QONwEIMd7z0zRKStVtdr4suquMlqeVWoZ//zwZChpQuqeEIcbktquImirUskK0GgsYIcbf/zwOLwEPqWif/0gDvWSMAb7soqeMGfcFGrUsOh7cIdLrtyhEFZafSXjT9vgU4gqIYgKP2oxR1lHuZsj8Hcq9Ap1vLvjQ7rckDWJaXbGfFYD7Vdy4rlINytWmusE/HjDLtaCT2hhMnfLLvcyF3Z3dytpxgiX/Hw1SOwD4aj5Q3nnD6ywIBUY6DvVSTqVG3ZVE1a5bbXDKNu4ZMlI2MV1kVUYjWBd/FAAAAJ3RSTlMAbt3EBeKCCxs7J/zqcva2ufPsWO/oQs3Hqoa1z2/lcqncrreuyMjnMWjgAAABtUlEQVQokW3SaVuCQBAAYFAS8HjserrU7mKXQwElPMIzNS3z6D7//89odsBIa76gvI4zuzMcF4YoHRzIIvc3BEnOne6/95MnvCwt/kCQc8f7hUKzUfrIk2Q6tpCfyhZYvFPa9/KEkAgfWnznqQnWnFBaGjMkEfmnkYw67QHelSikVlBXpaBgal1V1TtMpHqphkhiftktZupTExMpbZRR13i/oIrRm6DRhxpmYlkh5dvldfUBUWepRYhdkROzgWmDqo9uzcRYkTjxvDcFu9I0beDqVKfVYVvBYBj9CEzTbl3dHQ6MdiJEuxeYYQyrt/B4+YVK7cpgpF20Xy/gk9G5CbHccCHh7WUE75bxrA9duNdjG76bgMbbyCmapo8ZdjH682xmIxra55dD4KDsKMIeHm5cqd9X2N92Rq+PLbwiuAQuvs10lu9a9a7daZcTpNUKp7axCbPw8pW6ZdXLrBPn0WMXL+BY9jb1Bkyia1kW60oxW05xPjIufqg/A3r3ASqe8zNsmOg2Tng2R9MJ1wTKHjGEVB+VSFAwWM1YOkmgJ4Yr0djSasNS8+lk106ASP9tvSjziznfYTRlOprKdT4AAAAASUVORK5CYII=' }}
              logoSize={50}
              logoBackgroundColor='white'
            /> */}
            <QRCodeStyled
              data={qrValue}
              style={{ backgroundColor: 'white' }}
              logo={{
                href: require('../../assets/images/Ferroglobe_Logo.png'),
                padding: 4,
                scale: 1.4,
              }}
              padding={20}
              pieceSize={3}
            />

            <Text style={styles.nameText}>{firstName} {lastName}</Text>
            <Button icon="share-variant" onPress={shareQRCode} mode="contained" buttonColor="#005eb8" textColor="#ffffff">
              Share QR Code
            </Button>
          </View>
        )}


        <Link href="/signUp" asChild>
          <TouchableOpacity style={styles.button}>
            <Button mode="contained" icon="card-account-details" buttonColor="#005eb8" textColor="#ffffff">
              Show Details
            </Button>
          </TouchableOpacity>
        </Link>


        {/* <Button onPress={() => navigation.navigate('SignUp')} style={styles.button}
          mode="contained"
          icon="card-account-details"
          buttonColor="#005eb8"
          textColor="#ffffff">
          Show Details
        </Button> */}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  qrCode: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
});

export default HomeScreen;








