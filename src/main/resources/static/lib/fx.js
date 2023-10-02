export const fadeOut = (id) => new Promise((resolve) => {
  const el = document.getElementById(id);
  if (el) {
    console.debug("fading out " + id);
    el.classList.add('fading');
    setTimeout(() => resolve(), 600);
  } else {
    console.debug("Unable to find element with id " + id);
  }
});

export const fadeIn = (id) => new Promise((resolve) => {
  const el = document.getElementById(id);
  if (el) {
    console.debug("fading in " + id);
    el.classList.remove('fading');
    setTimeout(() => resolve(), 600);
  } else {
    console.debug("Unable to find element with id " + id);
  }
});

export const transition = (from, to, change) => {
  return fadeOut(from)
      .then(() => throttle(change))
      .then(() => fadeIn(to));
};

export const throttle = (change) => new Promise((resolve) => {
  change();
  setTimeout(resolve, 10);
});

export const toast = (id) => {
  fadeIn(id).then(() => setTimeout(() => fadeOut(id), 2000));
};