import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createClient } from '@supabase/supabase-js';
import MyAppBar from '../../../components/appbar';
import MyColor from '../../../constants/color';
import { useRating } from '../store/rating_slice';
import { useAuth } from '../../../store/auth_slice';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

// Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'your-supabase-key'; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

const RatingScreen = () => {
  const route = useRoute<RouteProp<{ params: { session_id: string } }, 'params'>>();
  const { session_id } = route.params;
  const navigation = useNavigation();

  const { insertRating, getRating, updateRating } = useRating();
  const { uuid } = useAuth();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRating = async () => {
    setLoading(true);

    getRating(uuid, session_id).then((data : IReview) => {
      setLoading(false);
      setRating(data.rating);
      setReview(data.review);
    }).catch((error) => {
        console.error(error);
    })

    setLoading(false);
  };
  
  useEffect(() => {
    fetchRating();
  }, []);

  const handleSubmit = async () => {
  if (rating === 0) {
    Alert.alert('Error', 'Please select a rating.');
    return;
  }

  setLoading(true);

  // Kiểm tra nếu đã có rating trước đó
  const existingRating = await getRating(uuid, session_id);

  if (existingRating) {
    // Update rating nếu đã tồn tại
    updateRating(uuid, session_id, rating, review)
      .then((data) => {
        setLoading(false);
        console.log('Updated rating:', data);
        Alert.alert('Success', 'Review updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error updating rating:', error);
        Alert.alert('Error', 'Failed to update rating session.');
      });
  } else {
    // Insert rating nếu chưa tồn tại
    insertRating(uuid, session_id, rating, review)
      .then((data) => {
        setLoading(false);
        console.log('New rating:', data);
        Alert.alert('Success', 'Review session successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error submitting rating:', error);
        Alert.alert('Error', 'Failed to submit rating session.');
      });
  }
};


  return (
    <View style={styles.container}>
      {/* App Bar */}
      <MyAppBar headerTitle="Rating session" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={36} color={MyColor.primary} />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.title}>How would you rate this session?</Text>

          {/* Rating stars */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon
                  name="star"
                  size={32}
                  color={star <= rating ? 'gold' : 'gray'}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review input */}
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review here..."
            value={review}
            onChangeText={setReview}
            multiline
          />

          {/* Submit button */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 4,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RatingScreen;
