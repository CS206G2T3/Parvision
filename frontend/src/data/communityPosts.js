import foursomeImg from '../assets/foursome.png'
import balltraceVideo from '../assets/balltrace.mp4'
import swingVideo from '../assets/output_mediapipe1.mp4'

const STORAGE_KEY = 'parvision_posts'

export const SEED_POSTS = [
  {
    id: 1,
    community: 'Weekend Warriors',
    communityColor: '#a855f7',
    communityAbbr: 'WW',
    user: 'Non-Significant Other',
    avatarColor: '#a3c4a8',
    avatarLetter: 'N',
    time: '1h ago',
    body: 'Weekend foursome was a blast! Finally shot under 90 for the first time this season \u{1F389} The new wedge made all the difference on the back nine.',
    likes: 12,
    comments: 12,
    img: foursomeImg,
    tags: [],
  },
  {
    id: 2,
    community: 'Singapore Golfers',
    communityColor: '#248a3d',
    communityAbbr: 'SG',
    user: 'Marcus Hooy',
    avatarColor: '#f97316',
    avatarLetter: 'M',
    time: '2h ago',
    body: 'Swing looking slightly rough this session \u{1F605} Hoping the Swing Analyzer feedback helps me fix my C-posture before the weekend round.',
    likes: 40,
    comments: 14,
    img: null,
    video: swingVideo,
    tags: ['Swing Analyzer'],
  },
  {
    id: 4,
    community: 'Beginners Corner',
    communityColor: '#f97316',
    communityAbbr: 'BC',
    user: 'Fairway Phil',
    avatarColor: '#a855f7',
    avatarLetter: 'F',
    time: '1d ago',
    body: 'Hitting the golf range this coming Saturday 7pm at OCC, whos coming?',
    likes: 88,
    comments: 14,
    img: null,
    tags: ['OpenJio'],
  },
]

export function loadPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : SEED_POSTS
  } catch {
    return SEED_POSTS
  }
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}
