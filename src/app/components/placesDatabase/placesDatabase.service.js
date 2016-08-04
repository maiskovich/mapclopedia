export class PlacesDatabaseService {
  constructor ($localForage) {
    'ngInject';
    this.$localForage=$localForage;
    try {
      this.articlesInstance=$localForage.instance('articles');
    }
    catch(err) {
      this.articlesInstance = $localForage.createInstance({
        name: 'articles'
      });
    }
  }
  //Store places, using as key the coordinates at the moment of saving the data
  storePlaces(location,places) {
    return this.$localForage.setItem(location.coords.latitude+' '+location.coords.longitude,places);
  }
  //Get all the keys, this keys are the coordinates of the moment that the data was saved
  getLocationsKeys() {
    return this.$localForage.keys();
  }
  //return the data related to the key(the coordinates)
  getPlacesByKey(key) {
    return this.$localForage.getItem(key);
  }
  //Store articles using a unique key 'pageid' for each article
  storeArticles(article) {
    return this.articlesInstance.setItem(article.pageid,article.extract);
  }
  //Get all the keys of the articles instance
  getArticlesKeys() {
    return this.articlesInstance.keys();
  }
  //Get articles by key
  getArticlesByKey(key) {
    return this.articlesInstance.getItem(key);
  }


}
