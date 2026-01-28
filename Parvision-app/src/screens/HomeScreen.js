import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Camera, Upload, TrendingUp, Users, Award, Video, Clock, Target } from 'lucide-react-native';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');
  
  const recentSwings = [
    { id: 1, date: 'Jan 27, 2026', grade: 'B+', hipRotation: 52, improvement: '+5°' },
    { id: 2, date: 'Jan 25, 2026', grade: 'B', hipRotation: 47, improvement: '+2°' },
    { id: 3, date: 'Jan 23, 2026', grade: 'C+', hipRotation: 45, improvement: '-3°' },
  ];
  
  const stats = {
    totalSwings: 24,
    avgGrade: 'B',
    avgHipRotation: 48,
    improvement: '+12%'
  };

  const handleRecordSwing = () => {
    alert('Camera screen coming soon!');
  };

  const handleUploadVideo = () => {
    alert('Upload feature coming soon!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>ParVision</Text>
              <Text style={styles.subtitle}>Your AI Golf Coach</Text>
            </View>
            <View style={styles.logoCircle}>
              <Target color="#16a34a" size={24} />
            </View>
          </View>
          
          {/* User Info */}
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>DG</Text>
              </View>
              <View>
                <Text style={styles.userName}>David Goh</Text>
                <Text style={styles.userMeta}>Handicap: 18 • Beginner</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Video color="#16a34a" size={20} />
              <Text style={styles.statValue}>{stats.totalSwings}</Text>
              <Text style={styles.statLabel}>Swings</Text>
            </View>
            <View style={styles.statCard}>
              <Award color="#16a34a" size={20} />
              <Text style={styles.statValue}>{stats.avgGrade}</Text>
              <Text style={styles.statLabel}>Avg Grade</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp color="#16a34a" size={20} />
              <Text style={styles.statValue}>{stats.avgHipRotation}°</Text>
              <Text style={styles.statLabel}>Hip Rot.</Text>
            </View>
            <View style={styles.statCard}>
              <Target color="#16a34a" size={20} />
              <Text style={[styles.statValue, { color: '#16a34a' }]}>{stats.improvement}</Text>
              <Text style={styles.statLabel}>Better</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRecordSwing}>
              <View style={styles.buttonContent}>
                <View style={styles.buttonIcon}>
                  <Camera color="white" size={28} />
                </View>
                <View style={styles.buttonText}>
                  <Text style={styles.buttonTitle}>Record New Swing</Text>
                  <Text style={styles.buttonSubtitle}>Get instant AI analysis</Text>
                </View>
              </View>
              <Text style={styles.buttonArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleUploadVideo}>
              <View style={styles.buttonContent}>
                <View style={styles.secondaryButtonIcon}>
                  <Upload color="#16a34a" size={28} />
                </View>
                <View style={styles.buttonText}>
                  <Text style={styles.secondaryButtonTitle}>Upload Video</Text>
                  <Text style={styles.secondaryButtonSubtitle}>Analyze from gallery</Text>
                </View>
              </View>
              <Text style={styles.secondaryButtonArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Swings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Swings</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentSwings.map((swing) => (
              <TouchableOpacity key={swing.id} style={styles.swingCard}>
                <View style={styles.swingLeft}>
                  <View style={styles.swingIcon}>
                    <Video color="white" size={24} />
                  </View>
                  <View>
                    <View style={styles.swingDate}>
                      <Clock color="#9ca3af" size={14} />
                      <Text style={styles.swingDateText}>{swing.date}</Text>
                    </View>
                    <Text style={styles.swingMetric}>Hip Rotation: {swing.hipRotation}°</Text>
                  </View>
                </View>
                <View style={styles.swingRight}>
                  <View style={styles.gradeBadge}>
                    <Text style={styles.gradeText}>{swing.grade}</Text>
                  </View>
                  <Text style={styles.improvement}>{swing.improvement}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Community Preview */}
          <View style={styles.communityCard}>
            <View style={styles.communityHeader}>
              <View style={styles.communityTitle}>
                <Users color="#16a34a" size={24} />
                <Text style={styles.communityTitleText}>The 19th Hole</Text>
              </View>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            </View>
            <Text style={styles.communityDescription}>
              Connect with golfers at your level. Share swings, get feedback, find playing partners!
            </Text>
            <TouchableOpacity style={styles.communityButton}>
              <Text style={styles.communityButtonText}>Explore Community</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          onPress={() => setActiveTab('home')}
          style={styles.navItem}
        >
          <Target color={activeTab === 'home' ? '#16a34a' : '#9ca3af'} size={24} />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('camera')}
          style={styles.navItemCenter}
        >
          <View style={styles.cameraButton}>
            <Camera color="white" size={28} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('progress')}
          style={styles.navItem}
        >
          <TrendingUp color={activeTab === 'progress' ? '#16a34a' : '#9ca3af'} size={24} />
          <Text style={[styles.navLabel, activeTab === 'progress' && styles.navLabelActive]}>
            Progress
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('community')}
          style={styles.navItem}
        >
          <Users color={activeTab === 'community' ? '#16a34a' : '#9ca3af'} size={24} />
          <Text style={[styles.navLabel, activeTab === 'community' && styles.navLabelActive]}>
            Community
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#15803d',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#bbf7d0',
  },
  logoCircle: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: '#22c55e',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  userMeta: {
    fontSize: 14,
    color: '#bbf7d0',
  },
  content: {
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  actionButtons: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#16a34a',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonText: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#bbf7d0',
  },
  buttonArrow: {
    fontSize: 32,
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#16a34a',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#f0fdf4',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  secondaryButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  secondaryButtonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  secondaryButtonArrow: {
    fontSize: 32,
    color: '#16a34a',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  swingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  swingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  swingIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  swingDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  swingDateText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  swingMetric: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  swingRight: {
    alignItems: 'flex-end',
  },
  gradeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#15803d',
  },
  improvement: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  communityCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  newBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  communityDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  communityButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  communityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemCenter: {
    marginTop: -32,
  },
  cameraButton: {
    width: 64,
    height: 64,
    backgroundColor: '#16a34a',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#16a34a',
  },
});