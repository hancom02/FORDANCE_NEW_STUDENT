import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyColor from '../../../constants/color';
import SizedBox from '../../../components/size_box';

interface StarRatingProps {
  rating: number; // Giá trị từ 1 đến 5
  handlePress: () => {}
}

const StarRating: React.FC<StarRatingProps> = ({ rating, handlePress }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Ngôi sao được fill đầy
        stars.push(
          <Icon key={i} name="star" size={24} color="#FFD700" style={styles.star} />
        );
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        // Ngôi sao được fill một nửa
        stars.push(
          <View key={i} style={styles.halfStarContainer}>
            <View style={styles.halfStar}>
              <Icon name="star" size={24} color="#FFD700" />
            </View>
            <Icon name="star-o" size={24} color="#FFD700" />
          </View>
        );
      } else {
        // Ngôi sao viền ngoài
        stars.push(
          <Icon key={i} name="star-o" size={24} color="#FFD700" style={styles.star} />
        );
      }
    }
    return stars;
  };

  return <TouchableOpacity style={styles.container} onPress={handlePress}>
          {rating > 0 ? (
            <>
              {renderStars()}
              <SizedBox width={4} height={0} backgroundColor={MyColor.white} />
              <Text style={styles.text}>({rating})</Text>
            </>
          ) : (
            <Text style={styles.text}>No rating yet</Text> // Hiển thị khi rating = 0
          )}
        </TouchableOpacity>
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    // backgroundColor: MyColor.black
  },
  star: {
    marginHorizontal: 2,
  },
  halfStarContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    flexDirection: 'row',
  },
  halfStar: {
    position: 'absolute',
    overflow: 'hidden',
    width: 12, // Chỉ fill nửa trái
    height: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'orange'
  }
});

export default StarRating;
