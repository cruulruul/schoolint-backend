const database = require('../../database');

const candidatesTagsService = {};

// Returns tags
candidatesTagsService.getAllCandidatesTags = () => {
  const { tags } = database;
  return tags;
};

// Creates tag
candidatesTagsService.createTag = (newTag) => {
  const id = database.tags.length + 1;
  const tag = {
    id,
    name: newTag.name,
    courseId: newTag.courseId,
  };

  database.tags.push(tag);
  return { id };
};

// Updates tags
candidatesTagsService.updateTag = (tagToUpdate) => {
  const index = database.tags.findIndex(
    (element) => element.id === tagToUpdate.id,
  );
  if (tagToUpdate.name) {
    database.tags[index].name = tagToUpdate.name;
  }
  if (tagToUpdate.courseId) {
    database.tags[index].courseId = tagToUpdate.courseId;
  }

  return true;
};

module.exports = candidatesTagsService;
