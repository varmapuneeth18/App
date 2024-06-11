import React, { useState, useEffect } from 'react';
import { MD3Colors, IconButton } from 'react-native-paper';
import { View, StyleSheet, ScrollView, Text, ImageBackground  } from 'react-native';
import { Button, Dialog, Portal, Provider as PaperProvider, TextInput, Menu} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import bgImg from '../../assets/images/bgImage.png'; // Use require instead of import
const bgImg = require('../../assets/images/bgImage.png'); // Dynamic require for image




// Define an interface for the user data
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

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [isQRVisible, setIsQRVisible] = useState(false);

  // State variables to store form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [phone, setPhone] = useState('');
  const [emailUsername, setEmailUsername] = useState('');
  const [emailDomain, setEmailDomain] = useState('@ferroglobe.com');
  const [company, setCompany] = useState('Ferroglobe'); // Default value
  const [Title, setTitle] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('https://www.ferroglobe.com/'); // Default value
   // This is for git info  branch

  // Use the UserData interface for the stored data state
  const [storedData, setStoredData] = useState<UserData | null>(null);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
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
        setCompany(userData.company || 'Ferroglobe'); // Ensure default value is set
        setTitle(userData.Title);
        setAddress1(userData.address1);
        setAddress2(userData.address2);
        setCity(userData.city);
        setZip(userData.zip);
        setState(userData.state);
        setCountry(userData.country);
        setWebsite(userData.website || 'https://www.ferroglobe.com/'); // Ensure default value is set
        setHasData(true);
        generateQRCode(userData);
      }
    } catch (error) {
      console.error('Failed to load data', error);
    }
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
      setStoredData(userData);
      setVisible(false);
      setIsEditing(false);
      setHasData(true);
      generateQRCode(userData);
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  const showFormDialog = () => {
    setVisible(true);
    setIsEditing(false); // Set to false to view details without editing
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const hideDialog = () => setVisible(false);

  const handleInputChange = (field: string, value: string, maxLength: number, setState: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.length <= maxLength) {
      setState(value);
      setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, [field]: `Maximum ${maxLength} characters allowed` }));
    }
  };

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

  const [emailMenuVisible, setEmailMenuVisible] = useState(false);

  return (
    <PaperProvider>
      <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        {isQRVisible && (
          <View style={styles.qrCode}>
            <QRCode
              value={qrValue}
              size={200}
              color="black"
              backgroundColor="white"
			  logo={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABHVBMVEVHcEwPdbUKc7gGg8d1p3sKgsYNe7wkiL0ViMoTfsDCySsQgcMHcbeLv0U4rcsLcrgKcrcKcbeMv0P4zgT/zwXdxRq/xy7/0QONwEIMd7z0zRKStVtdr4suquMlqeVWoZ//zwZChpQuqeEIcbktquImirUskK0GgsYIcbf/zwOLwEPqWif/0gDvWSMAb7soqeMGfcFGrUsOh7cIdLrtyhEFZafSXjT9vgU4gqIYgKP2oxR1lHuZsj8Hcq9Ap1vLvjQ7rckDWJaXbGfFYD7Vdy4rlINytWmusE/HjDLtaCT2hhMnfLLvcyF3Z3dytpxgiX/Hw1SOwD4aj5Q3nnD6ywIBUY6DvVSTqVG3ZVE1a5bbXDKNu4ZMlI2MV1kVUYjWBd/FAAAAJ3RSTlMAbt3EBeKCCxs7J/zqcva2ufPsWO/oQs3Hqoa1z2/lcqncrreuyMjnMWjgAAABtUlEQVQokW3SaVuCQBAAYFAS8HjserrU7mKXQwElPMIzNS3z6D7//89odsBIa76gvI4zuzMcF4YoHRzIIvc3BEnOne6/95MnvCwt/kCQc8f7hUKzUfrIk2Q6tpCfyhZYvFPa9/KEkAgfWnznqQnWnFBaGjMkEfmnkYw67QHelSikVlBXpaBgal1V1TtMpHqphkhiftktZupTExMpbZRR13i/oIrRm6DRhxpmYlkh5dvldfUBUWepRYhdkROzgWmDqo9uzcRYkTjxvDcFu9I0beDqVKfVYVvBYBj9CEzTbl3dHQ6MdiJEuxeYYQyrt/B4+YVK7cpgpF20Xy/gk9G5CbHccCHh7WUE75bxrA9duNdjG76bgMbbyCmapo8ZdjH682xmIxra55dD4KDsKMIeHm5cqd9X2N92Rq+PLbwiuAQuvs10lu9a9a7daZcTpNUKp7axCbPw8pW6ZdXLrBPn0WMXL+BY9jb1Bkyia1kW60oxW05xPjIufqg/A3r3ASqe8zNsmOg2Tng2R9MJ1wTKHjGEVB+VSFAwWM1YOkmgJ4Yr0djSasNS8+lk106ASP9tvSjziznfYTRlOprKdT4AAAAASUVORK5CYII=' }}
              logoSize={50}
              logoBackgroundColor='white'
          
            />
            <Text style={styles.nameText}>{firstName} {lastName}</Text>
          </View>
        )}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Details</Dialog.Title>
            <Dialog.Actions style={styles.dialogActions}>
              {isEditing && <Button onPress={saveDetails} mode="contained" buttonColor="#005eb8" textColor="#ffffff">Save</Button>}
              {!isEditing && <Button icon="pencil" onPress={enableEditing} mode="contained" buttonColor="#005eb8" textColor="#ffffff">Edit</Button>}
              <Button onPress={hideDialog} icon="close" mode="contained" buttonColor="#005eb8" textColor="#ffffff">Close</Button>
            </Dialog.Actions>
            <Dialog.ScrollArea>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TextInput
                  label="First name"
                  value={firstName}
                  onChangeText={(text) => handleInputChange('firstName', text, 15, setFirstName)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={15}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
                <TextInput
                  label="Last name"
                  value={lastName}
                  onChangeText={(text) => handleInputChange('lastName', text, 15, setLastName)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={15}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
                <TextInput
                  label="Mobile"
                  value={mobile}
                  onChangeText={(text) => handleInputChange('mobile', text, 13, setMobile)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={13}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
                <View style={styles.emailContainer}>
                  <TextInput
                    label="Email"
                    value={emailUsername}
                    onChangeText={(text) => handleInputChange('emailUsername', text, 50, setEmailUsername)}
                    style={[styles.input, styles.emailInput]}
                    editable={isEditing}
                    maxLength={50}
                    theme={{ colors: { primary: '#6200ee' } }}
                  />
                  <Menu
                    visible={emailMenuVisible}
                    onDismiss={() => setEmailMenuVisible(false)}
                    anchor={
                      <TextInput
                        value={emailDomain}
                        style={[styles.input, styles.emailDropdown]}
                        editable={false}
                        onPressIn={() => setEmailMenuVisible(true)}
                        theme={{ colors: { primary: '#6200ee' } }}
                      />
                    }
                  >
                    <Menu.Item onPress={() => setEmailDomain('@ferroglobe.com')} title="@ferroglobe.com" />
                    <Menu.Item onPress={() => setEmailDomain('@wvamfg.com')} title="@wvamfg.com" />
                  </Menu>
                </View>
                {errors.emailUsername ? <Text style={styles.errorText}>{errors.emailUsername}</Text> : null}
                <TextInput
                  label="Company"
                  value={company}
                  onChangeText={setCompany}
                  style={styles.input}
                  editable={true}
                  disabled
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                <TextInput
                  label="Title"
                  value={Title}
                  onChangeText={setTitle}
                  style={styles.input}
                  editable={isEditing}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                <TextInput
                  label="Address 1"
                  value={address1}
                  onChangeText={(text) => handleInputChange('address1', text, 35, setAddress1)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={35}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.address1 ? <Text style={styles.errorText}>{errors.address1}</Text> : null}
                <TextInput
                  label="Address 2"
                  value={address2}
                  onChangeText={(text) => handleInputChange('address2', text, 35, setAddress2)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={35}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.address2 ? <Text style={styles.errorText}>{errors.address2}</Text> : null}
                <TextInput
                  label="City"
                  value={city}
                  onChangeText={(text) => handleInputChange('city', text, 20, setCity)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={20}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
                <TextInput
                  label="State"
                  value={state}
                  onChangeText={(text) => handleInputChange('state', text, 20, setState)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={20}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
                <TextInput
                  label="ZIP"
                  value={zip}
                  onChangeText={(text) => handleInputChange('zip', text, 10, setZip)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={10}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.zip ? <Text style={styles.errorText}>{errors.zip}</Text> : null}
                <TextInput
                  label="Country"
                  value={country}
                  onChangeText={(text) => handleInputChange('country', text, 15, setCountry)}
                  style={styles.input}
                  editable={isEditing}
                  maxLength={15}
                  theme={{ colors: { primary: '#6200ee' } }}
                />
                {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}
                <TextInput
                  label="Website"
                  value={website}
                  onChangeText={setWebsite}
                  style={styles.input}
                  editable={true}
                  disabled
                  theme={{ colors: { primary: '#6200ee' } }}
                />
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog>
        </Portal>
        <Button onPress={showFormDialog} style={styles.button} 
        mode="contained" 
        buttonColor="#005eb8"
        textColor="#ffffff">

          Show Details
        </Button>
      </View>
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    marginBottom: 0,
  },
  scrollContainer: {
    paddingHorizontal: 0,
  },
  input: {
    marginBottom: 2,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,  // Curved top-left corner
    borderTopRightRadius: 20, // Curved top-right corner
    borderBottomLeftRadius: 20, // Curved bottom-left corner
    borderBottomRightRadius: 20, // Curved bottom-right corner
    borderWidth: 1,
    borderColor: '#005eb8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  dialogActions: {
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingRight: 16,
  },
  qrCode: {
    marginVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emailInput: {
    flex: 3,
    marginRight: 8,
  },
  emailDropdown: {
    flex: 2,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000', // You can change the color as needed
  },

});
