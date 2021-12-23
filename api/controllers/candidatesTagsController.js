const { candidatesTagsService } = require('../services');

const candidatesTagsController = {};

/**
 * Get all candidates tags
 * GET - /tags
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of candidates tags
 */

candidatesTagsController.getAllCandidatesTags = (req, res) => {
  const tags = candidatesTagsService.getAllCandidatesTags();
  res.status(200).json({ tags });
};

candidatesTagsController.createTag = async (req, res) => {
  const { name, courseId } = req.body;
  if (!name || !courseId) {
    res.status(400).json('Required data missing');
  }
  const newTag = {
    name,
    courseId,
  };
  const data = await candidatesTagsService.createTag(newTag);

  return res.status(201).json({
    id: data.id,
  });
};

candidatesTagsController.updateTag = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, courseId } = req.body;

  if (!id && !(name || courseId)) {
    res.status(400).json({
      error: `No tag found with id: ${id}`,
    });
  }

  const tagToUpdate = {
    id,
    name,
    courseId,
  };
  const success = await candidatesTagsService.updateTag(tagToUpdate);

  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while updating tag',
    });
  }

  return res.status(200).json({
    success: true,
  });
};

module.exports = candidatesTagsController;
