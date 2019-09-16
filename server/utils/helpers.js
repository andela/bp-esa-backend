import path from 'path';
/**
 * Set the appRoot for the application
 *
 * @param   {string}  basePath  path to set as App root
 *
 * @return  {void}
 */
export const setAppRoot = (basePath) => {
  global.appRoot = basePath;
};

/**
 * Set the appRoot for the application
 *
 * @param   {string}  defaultPath  path to set App root (optional)
 *
 * @return  {void}
 */
export const getAppRoot = () => global.appRoot;

export const getTemplatesPath = () => path.join(__dirname, '../../templates');
