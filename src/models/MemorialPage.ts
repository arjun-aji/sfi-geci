import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface IGalleryItem {
  mediaType?: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  caption: string;
  date?: string;
  source?: string;
  altText?: string;
}

export interface ISourceItem {
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
}

export interface IKeyFacts {
  age: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  from: string;
  dateOfDeath: string;
}

export interface IMemorialPage extends Document {
  title: string;
  slug: string;
  subtitle: string;
  heroImage: string;
  introduction: string;
  keyFacts: IKeyFacts;
  studentLife: string;
  incident: string;
  caseInformation: string;
  finalDays: string;
  remembrance: string;
  timeline: ITimelineEvent[];
  gallery: IGalleryItem[];
  sources: ISourceItem[];
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineSchema = new Schema<ITimelineEvent>(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const GallerySchema = new Schema<IGalleryItem>(
  {
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    imageUrl: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    caption: { type: String, required: true },
    date: { type: String, default: '' },
    source: { type: String, default: '' },
    altText: { type: String, default: '' },
  },
  { _id: false }
);

const SourceSchema = new Schema<ISourceItem>(
  {
    title: { type: String, required: true },
    publisher: { type: String, required: true },
    date: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const MemorialPageSchema = new Schema<IMemorialPage>(
  {
    title: { type: String, required: true, default: 'Comrade Dheeraj Rajendran' },
    slug: { type: String, required: true, unique: true, default: 'comrade-dheeraj' },
    subtitle: { type: String, required: true, default: 'A Student. A Comrade. Remembered by GECI.' },
    heroImage: { type: String, default: '/images/dheeraj-portrait.png' },
    introduction: {
      type: String,
      required: true,
      default:
        'Remembering Dheeraj Rajendran, a Computer Science and Engineering student of Government Engineering College, Idukki, whose life was cut short during violence surrounding the college union election in January 2022.',
    },
    keyFacts: {
      age: { type: String, default: '21' },
      college: { type: String, default: 'Government Engineering College, Idukki' },
      course: { type: String, default: 'B.Tech' },
      department: { type: String, default: 'Computer Science and Engineering' },
      semester: { type: String, default: 'Seventh semester' },
      from: { type: String, default: 'Palakkulangara, near Taliparamba, Kannur' },
      dateOfDeath: { type: String, default: '10 January 2022' },
    },
    studentLife: {
      type: String,
      required: true,
      default:
        'Dheeraj was pursuing his B.Tech in Computer Science and Engineering at Government Engineering College, Idukki, and was in his seventh semester when he died. As a dedicated student and student activist affiliated with the Students\' Federation of India (SFI), he was actively involved in academic and campus life at Painavu.',
    },
    incident: {
      type: String,
      required: true,
      default:
        'On 10 January 2022, violence broke out around the student union election at Government Engineering College, Idukki. Dheeraj Rajendran, a 21-year-old seventh-semester Computer Science and Engineering student and SFI activist, was fatally stabbed during the confrontation. Two other SFI members were also injured in the clash.',
    },
    caseInformation: {
      type: String,
      required: true,
      default:
        'Contemporary reports stated that Dheeraj was allegedly stabbed by Nikhil Paily, a Youth Congress functionary. Police arrested Paily and other individuals in connection with the case. Reports described the incident as occurring during clashes involving SFI and KSU/Youth Congress activists around the college union election. The police subsequently filed charges and the legal proceedings were initiated in the designated courts.',
    },
    finalDays: {
      type: String,
      required: true,
      default:
        'Following the confrontation outside the campus gate during election voting hours, Dheeraj was rushed immediately to the Government Medical College Hospital, Idukki, after sustaining serious injuries. Despite emergency medical interventions by the attending medical team, he could not be saved. Contemporary reporting indicated that the postmortem examination identified a deep stab wound to the chest area as the fatal cause.',
    },
    remembrance: {
      type: String,
      required: true,
      default:
        'Dheeraj\'s death left a lasting mark on the student community at GECI and across Kerala. His name continues to be remembered by students, friends, faculty, and members of the SFI community. The campus library and student facilities at GECI commemorate his memory as an enduring reminder of peace, student rights, and the collective resolve against violence on educational campuses.',
    },
    timeline: [TimelineSchema],
    gallery: [GallerySchema],
    sources: [SourceSchema],
    seoTitle: { type: String, default: 'Comrade Dheeraj Rajendran | SFI GECI' },
    seoDescription: {
      type: String,
      default:
        'Remembering Dheeraj Rajendran, a seventh-semester Computer Science and Engineering student of Government Engineering College, Idukki, who died during violence surrounding the college union election in January 2022.',
    },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MemorialPage ||
  mongoose.model<IMemorialPage>('MemorialPage', MemorialPageSchema);
