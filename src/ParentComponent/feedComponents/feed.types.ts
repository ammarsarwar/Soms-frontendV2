// import { z } from "zod";

// const VideoSchema = z.object({
//   id: z.number(),
//   video_link: z.string(),
// });

// const ReactionSchema = z.object({
//   id: z.number(),
//   reacted_by: z.object({
//     id: z.number(),
//     first_name: z.string(),
//     last_name: z.string(),
//     email: z.string().email(),
//   }),
//   reaction_type: z.string(),
// });

// const ImageSchema = z.object({
//   id: z.number(),
//   image: z.string(),
// });

// const CampusSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   branch: z.object({
//     id: z.number(),
//     name: z.string(),
//     school: z.object({
//       id: z.number(),
//       name: z.string(),
//     }),
//   }),
// });

// const TargetedDepartmentSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   campus: CampusSchema,
// });

// const TargetedSectionSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   max_no_of_student: z.number(),
//   created: z.string(),
//   grade: z.number(),
//   home_room_teacher: z.nullable(z.unknown()),
// });

// const PostedBySchema = z.object({
//   id: z.number(),
//   first_name: z.string(),
//   last_name: z.string(),
//   email: z.string().email(),
// });

// const PostsSchema = z.object({
//   id: z.number(),
//   image: z.array(ImageSchema),
//   video: z.array(VideoSchema),
//   targeted_department: z.array(TargetedDepartmentSchema),
//   targeted_section: z.array(TargetedSectionSchema),
//   reactions: z.array(ReactionSchema),
//   posted_by: PostedBySchema,
//   text: z.string(),
//   only_for_staff: z.boolean(),
//   only_for_admins: z.boolean(),
//   created: z.string(),
// });




// import { z } from "zod";

// const UserSchema = z.object({
//   id: z.number(),
//   first_name: z.string(),
//   last_name: z.string(),
//   email: z.string(),
// });

// const ImageSchema = z.object({
//   id: z.number(),
//   image: z.string(),
// });

// const VideoSchema = z.object({
//   id: z.number(),
//   video_link: z.string(),
// });

// const ReactionSchema = z.object({
//   id: z.number(),
//   reacted_by: UserSchema,
//   reaction_type: z.string(),
// });

// const CampusSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   branch: z.object({
//     id: z.number(),
//     name: z.string(),
//     school: z.object({
//       id: z.number(),
//       name: z.string(),
//     }),
//   }),
// });

// const TargetedDepartmentSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   campus: CampusSchema,
// });

// const TargetedSectionSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   max_no_of_student: z.number(),
//   created: z.string(), 
//   grade: z.number(),
//     home_room_teacher: z.nullable(z.unknown()),
// });

// const PostsSchema = z.object({
//   created: z.string(),
//   id: z.number(),
//   images: z.array(ImageSchema),
//   only_for_admins: z.boolean(),
//   only_for_staff: z.boolean(),
//   posted_by: UserSchema,
//   reactions: z.array(ReactionSchema),
//   targeted_department: z.array(TargetedDepartmentSchema),
//   targeted_section: z.array(TargetedSectionSchema),
//   text: z.string(),
//   videos: z.array(VideoSchema),
// });


import { z } from "zod";

const imageSchema = z.object({
  id: z.number(),
  image: z.string(),
});

const videoSchema = z.object({
  id: z.number(),
  video_link: z.string(),
});

const documentSchema = z.object({
  id: z.number(),
  document_link: z.string(),
});

const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  campus: z.object({
    id: z.number(),
    name: z.string(),
    branch: z.object({
      id: z.number(),
      name: z.string(),
      school: z.object({
        id: z.number(),
        name: z.string(),
      }),
    }),
  }),
});

const sectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
  grade: z.number(),
  home_room_teacher: z.nullable(z.unknown()),
});

const reactionSchema = z.object({
  id: z.number(),
  reacted_by: z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
  }),
  reaction_type: z.string(),
});

// Define the main schema for the API response

const PostsSchema = z.object({
  id: z.number(),
  images: z.array(imageSchema),
  videos: z.array(videoSchema),
  documents: z.array(documentSchema),
  targeted_department: z.array(departmentSchema),
  targeted_section: z.array(sectionSchema),
  reactions: z.array(reactionSchema),
  posted_by: z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
  }),
  text: z.string(),
  only_for_staff: z.boolean(),
  only_for_admins: z.boolean(),
  created: z.string(), // Assuming this is a date string
});

  export type TPostSchema = z.infer<typeof PostsSchema>