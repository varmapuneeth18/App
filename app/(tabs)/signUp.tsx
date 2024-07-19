import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput, Menu, useTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import QRCodeStyled from 'react-native-qrcode-styled';


type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
// type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
  // route: SignUpScreenRouteProp;
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

const SignUp: React.FC<Props> = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const theme = useTheme();
  const qrCodeRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emailMenuVisible, setEmailMenuVisible] = useState(false);
  const [qrValue, setQRValue] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [phone, setPhone] = useState('');
  const [emailUsername, setEmailUsername] = useState('');
  const [emailDomain, setEmailDomain] = useState('@ferroglobe.com');
  const [company, setCompany] = useState('Ferroglobe');
  const [Title, setTitle] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('https://www.ferroglobe.com/');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    phone: '',
    Title: '',
    emailUsername: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    state: '',
    country: '',
  });

  const loadDetails = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data !== null) {
        const userData: UserData = JSON.parse(data);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setMobile(userData.mobile);
        setPhone(userData.phone);
        const [username, domain] = userData.email.split('@');
        setEmailUsername(username);
        setEmailDomain('@' + domain);
        setCompany(userData.company || 'Ferroglobe');
        setTitle(userData.Title);
        setAddress1(userData.address1);
        setAddress2(userData.address2);
        setCity(userData.city);
        setZip(userData.zip);
        setState(userData.state);
        setCountry(userData.country);
        setWebsite(userData.website || 'https://www.ferroglobe.com/');
        generateQRCode(userData);
      }
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const generateQRCode = (userData: UserData) => {
    if (!userData) {
      return;
    }
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
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const saveDetails = async () => {
    try {
      const userData: UserData = {
        firstName,
        lastName,
        mobile,
        phone,
        email: `${emailUsername}${emailDomain}`,
        company,
        Title,
        address1,
        address2,
        city,
        zip,
        state,
        country,
        website
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      generateQRCode(userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  const handleInputChange = (field: string, value: string, maxLength: number, setState: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.length <= maxLength) {
      setState(value);
      setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, [field]: `Maximum ${maxLength} characters allowed` }));
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button icon="arrow-left" mode="contained" onPress={() => navigation.goBack()} style={styles.backButton} buttonColor="#005eb8" textColor="#ffffff">
            Back
          </Button>
          {isEditing ? (
            <Button icon="content-save" mode="contained" onPress={saveDetails} style={styles.editButton} buttonColor="#005eb8" textColor="#ffffff">
              Save
            </Button>
          ) : (
            <Button icon="pencil" mode="contained" onPress={() => setIsEditing(true)} style={styles.editButton} buttonColor="#005eb8" textColor="#ffffff">
              Edit
            </Button>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputRow}>
            <Icon name="account" size={20} color="#FFBF00" style={styles.icon} />
            <TextInput
              label="First name"
              value={firstName}
              onChangeText={(text) => handleInputChange('firstName', text, 15, setFirstName)}
              style={styles.input}
              editable={isEditing}
              maxLength={15}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="account" size={20} color="#FFBF00" style={styles.icon} />
            <TextInput
              label="Last name"
              value={lastName}
              onChangeText={(text) => handleInputChange('lastName', text, 15, setLastName)}
              style={styles.input}
              editable={isEditing}
              maxLength={15}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="email" size={20} color="#FF0000" style={styles.icon} />
            <TextInput
              label="Enter email"
              value={emailUsername}
              onChangeText={(text) => handleInputChange('emailUsername', text, 50, setEmailUsername)}
              style={styles.input}
              editable={isEditing}
              maxLength={50}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <Menu
              visible={emailMenuVisible}
              onDismiss={() => setEmailMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setEmailMenuVisible(true)}>
                  <View style={styles.emailDomainContainer}>
                    <Text>{emailDomain}</Text>
                  </View>
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => setEmailDomain('@ferroglobe.com')} title="@ferroglobe.com" />
              <Menu.Item onPress={() => setEmailDomain('@wvamfg.com')} title="@wvamfg.com" />
            </Menu>
          </View>
          {errors.emailUsername ? <Text style={styles.errorText}>{errors.emailUsername}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="phone" size={20} color="#0000FF" style={styles.icon} />
            <TextInput
              label="Phone number"
              value={mobile}
              onChangeText={(text) => handleInputChange('mobile', text, 13, setMobile)}
              style={styles.input}
              editable={isEditing}
              maxLength={13}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="office-building" size={20} color="#0000FF" style={styles.icon} />
            <TextInput
              label="Title"
              value={Title}
              onChangeText={(text) => handleInputChange('Title', text, 20, setTitle)}
              style={styles.input}
              editable={isEditing}
              maxLength={20}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.Title ? <Text style={styles.errorText}>{errors.Title}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="home" size={20} color="#8B4513" style={styles.icon} />
            <TextInput
              label="Mailing Address"
              value={address1}
              onChangeText={(text) => handleInputChange('address1', text, 35, setAddress1)}
              style={styles.input}
              editable={isEditing}
              maxLength={35}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.address1 ? <Text style={styles.errorText}>{errors.address1}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="city" size={20} color="#8B4513" style={styles.icon} />
            <TextInput
              label="City"
              value={city}
              onChangeText={(text) => handleInputChange('city', text, 20, setCity)}
              style={styles.input}
              editable={isEditing}
              maxLength={20}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="map" size={20} color="#8B4513" style={styles.icon} />
            <TextInput
              label="State"
              value={state}
              onChangeText={(text) => handleInputChange('state', text, 20, setState)}
              style={styles.input}
              editable={isEditing}
              maxLength={20}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="map-marker" size={20} color="#00FF00" style={styles.icon} />
            <TextInput
              label="ZIP Code"
              value={zip}
              onChangeText={(text) => handleInputChange('zip', text, 10, setZip)}
              style={styles.input}
              editable={isEditing}
              maxLength={10}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.zip ? <Text style={styles.errorText}>{errors.zip}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="earth" size={20} color="#8B4513" style={styles.icon} />
            <TextInput
              label="Country"
              value={country}
              onChangeText={(text) => handleInputChange('country', text, 15, setCountry)}
              style={styles.input}
              editable={isEditing}
              maxLength={15}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="office-building" size={20} color="#8B4513" style={styles.icon} />
            <TextInput
              label="Company"
              value={company}
              style={styles.input}
              editable={false}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
              disabled
            />
          </View>

          <View style={styles.inputRow}>
            <Icon name="web" size={20} color="#8B4513" style={styles.icon} />
            <TextInput
              label="Website"
              value={website}
              style={styles.input}
              editable={false}
              mode="flat"
              theme={{ colors: { primary: theme.colors.primary } }}
              disabled
            />
          </View>

          <View style={styles.bottomButtonContainer}>
            {isEditing ? (
              <Button icon="content-save" onPress={saveDetails} mode="contained" buttonColor="#005eb8" textColor="#ffffff" style={styles.bottomButton}>
                Save
              </Button>
            ) : (
              <Button icon="pencil" onPress={() => setIsEditing(true)} mode="contained" buttonColor="#005eb8" textColor="#ffffff" style={styles.bottomButton}>
                Edit
              </Button>
            )}
          </View>

          {/* <View style={styles.qrCodeContainer} ref={qrCodeRef}>

            <QRCodeStyled
              data={qrValue}
              style={{ backgroundColor: 'white' }}
              padding={20}
              pieceSize={8}
            />

            {/* <QRCode
              value={qrValue}
              size={200}
              color="black"
              backgroundColor="white"
              logo={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABHVBMVEVHcEwPdbUKc7gGg8d1p3sKgsYNe7wkiL0ViMoTfsDCySsQgcMHcbeLv0U4rcsLcrgKcrcKcbeMv0P4zgT/zwXdxRq/xy7/0QONwEIMd7z0zRKStVtdr4suquMlqeVWoZ//zwZChpQuqeEIcbktquImirUskK0GgsYIcbf/zwOLwEPqWif/0gDvWSMAb7soqeMGfcFGrUsOh7cIdLrtyhEFZafSXjT9vgU4gqIYgKP2oxR1lHuZsj8Hcq9Ap1vLvjQ7rckDWJaXbGfFYD7Vdy4rlINytWmusE/HjDLtaCT2hhMnfLLvcyF3Z3dytpxgiX/Hw1SOwD4aj5Q3nnD6ywIBUY6DvVSTqVG3ZVE1a5bbXDKNu4ZMlI2MV1kVUYjWBd/FAAAAJ3RSTlMAbt3EBeKCCxs7J/zqcva2ufPsWO/oQs3Hqoa1z2/lcqncrreuyMjnMWjgAAABtUlEQVQokW3SaVuCQBAAYFAS8HjserrU7mKXQwElPMIzNS3z6D7//89odsBIa76gvI4zuzMcF4YoHRzIIvc3BEnOne6/95MnvCwt/kCQc8f7hUKzUfrIk2Q6tpCfyhZYvFPa9/KEkAgfWnznqQnWnFBaGjMkEfmnkYw67QHelSikVlBXpaBgal1V1TtMpHqphkhiftktZupTExMpbZRR13i/oIrRm6DRhxpmYlkh5dvldfUBUWepRYhdkROzgWmDqo9uzcRYkTjxvDcFu9I0beDqVKfVYVvBYBj9CEzTbl3dHQ6MdiJEuxeYYQyrt/B4+YVK7cpgpF20Xy/gk9G5CbHccCHh7WUE75bxrA9duNdjG76bgMbbyCmapo8ZdjH682xmIxra55dD4KDsKMIeHm5cqd9X2N92Rq+PLbwiuAQuvs10lu9a9a7daZcTpNUKp7axCbPw8pW6ZdXLrBPn0WMXL+BY9jb1Bkyia1kW60oxW05xPjIufqg/A3r3ASqe8zNsmOg2Tng2R9MJ1wTKHjGEVB+VSFAwWM1YOkmgJ4Yr0djSasNS8+lk106ASP9tvSjziznfYTRlOprKdT4AAAAASUVORK5CYII=' }}
              logoSize={50}
              logoBackgroundColor='white'
            /> */}
            {/* <Button icon="share-variant" onPress={shareQRCode} mode="contained" buttonColor="#005eb8" textColor="#ffffff">
              Share QR Code
            </Button> */}
          {/* </View>  */}
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  icon: {
    marginLeft: 5,
  },
  emailDomainContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    height: 56,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  backButton: {
    marginBottom: 10,
  },
  editButton: {
    marginBottom: 10,
  },
  bottomButtonContainer: {
    marginTop: 20,
  },
  bottomButton: {
    width: '100%',
    justifyContent: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default SignUp;


// import React from 'react';
// import { View, Text } from 'react-native';

// export default function SignUpScreen() {
//   return (
//     <View>
//       <Text>Sign Up Screen</Text>
//     </View>
//   );
// }
