import { Fkey } from './model/resource';

export interface RelationRemovalCallback {
  (): RelationRemovalSchema;
}

export type RelationRemovalSchema = {
  [s in Fkey]: RelationRemovalSchema | RelationRemovalCallback
}

// example:
const commentRemovalSchema = () => ({
  likeIds: {},
  childIds: commentRemovalSchema
});

const userRemovalSchema: RelationRemovalSchema = {
  profile: {},
  authoredPostIds: {
    imageIds: {},
    commentIds: commentRemovalSchema
  }
};
