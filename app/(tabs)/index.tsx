import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Dialog, Portal, Provider as PaperProvider, TextInput } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [email, setEmail] = useState('');
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

  const loadDetails = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data !== null) {
        const userData: UserData = JSON.parse(data);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setMobile(userData.mobile);
        setPhone(userData.phone);
        setEmail(userData.email);
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
        email,
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

//   const generateQRCode = (userData: UserData) => {
//     const vCard = `
// BEGIN:VCARD
// VERSION:3.0
// FirstName:${userData.firstName}
// FullName:${userData.lastName};${userData.firstName}
// EMAIL:${userData.email}
// ORG:${userData.company}
// TEL:${userData.mobile}
// TITLE:${userData.Title}
// ADR:${userData.address1};${userData.address2};${userData.city};${userData.state};${userData.zip};${userData.country}
// URL:${userData.website}
// END:VCARD
//     `;
//     setQRValue(vCard.trim());
//     setIsQRVisible(true);
//   };

const generateQRCode = (userData: UserData) => {
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
};

  return (
    <PaperProvider>
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
            
          </View>
        )}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Details</Dialog.Title>
            <Dialog.Actions style={styles.dialogActions}>
              {!isEditing && <Button onPress={enableEditing} mode="contained" color="#6200ee">Edit</Button>}
              {isEditing && <Button onPress={saveDetails} mode="contained" color="#6200ee">Save</Button>}
              <Button onPress={hideDialog} mode="contained" color="#6200ee">Close</Button>
            </Dialog.Actions>
            <Dialog.ScrollArea>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TextInput
                  label="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="Mobile"
                  value={mobile}
                  onChangeText={setMobile}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="Company"
                  value={company}
                  onChangeText={setCompany}
                  style={styles.input}
                  editable={true}
				  disabled
                  
                />
                <TextInput
                  label="Title"
                  value={Title}
                  onChangeText={setTitle}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="Address 1"
                  value={address1}
                  onChangeText={setAddress1}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="Address 2"
                  value={address2}
                  onChangeText={setAddress2}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  style={styles.input}
                  editable={isEditing}
                />
                 <TextInput
                  label="Website"
                  value={website}
                  onChangeText={setWebsite}
                  style={styles.input}
                  editable={true} 
				  disabled
                />
                <TextInput
                  label="State"
                  value={state}
                  onChangeText={setState}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="ZIP"
                  value={zip}
                  onChangeText={setZip}
                  style={styles.input}
                  editable={isEditing}
                />
                <TextInput
                  label="Country"
                  value={country}
                  onChangeText={setCountry}
                  style={styles.input}
                  editable={isEditing}
                />
               
              </ScrollView>
            </Dialog.ScrollArea>

            
          </Dialog>
          
        </Portal>
        <Button onPress={showFormDialog} style={styles.button} mode="contained" color="#6200ee">
          Show Details
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: 'space-around', // Align elements with space around them
	  alignItems: 'center',
	  padding: 16,
	  backgroundColor: '#eee',
	},
	button: {
	  marginBottom: 30,
	},
	scrollContainer: {
	  paddingHorizontal: 10,
	},
	input: {
	  marginBottom: 8,
	  backgroundColor: 'white',
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
  });
  