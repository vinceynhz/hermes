#!/bin/bash
# To run the image with default configurations

IMAGE=hermes
COMMAND=run
ARGS=(--rm -itd)
PORT=60069

DRYRUN=0

CONTAINER_NAME=()
EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    -c|--command)
      COMMAND="$2"
      shift
      shift
      ;;
    -n|--name)
      CONTAINER_NAME=(--name "$2")
      shift
      shift
      ;;
    -p|--port)
      PORT="$2"
      shift
      shift
      ;;
    --dryrun)
      DRYRUN=1
      shift
      ;;
    -*|--*)
      EXTRA_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ "${COMMAND}" == "run" ]]; then
  if [[ ${DRYRUN} -eq 1 ]]; then
    echo "docker run "${ARGS[@]}" -p${PORT}:8080 "${EXTRA_ARGS[@]}" "${CONTAINER_NAME[@]}" "${IMAGE}""
  else
    docker_id=$(docker run "${ARGS[@]}" -p${PORT}:8080 "${EXTRA_ARGS[@]}" "${CONTAINER_NAME[@]}" "${IMAGE}")
    docker container ls -l
  fi
elif [[ "${COMMAND}" == "build" ]]; then
  echo "Getting any existing image for ${IMAGE}"
  image_id=$(docker image ls -a "${IMAGE}")

  if [[ ${image_id} == "" ]]; then
    echo "No existing ${IMAGE} image"
  else
    echo "Removing existing ${IMAGE} image"

    if [[ ${DRYRUN} -eq 1 ]]; then
      echo "docker image rm "${image_id}""
    else
      docker image rm "${image_id}"
      docker image ls -l
      echo "Image removed"
    fi
  fi

  echo "Building image"
  if [[ ${DRYRUN} -eq 1 ]]; then
    echo "docker build -t "${IMAGE}" ."
  else
    docker build -t "${IMAGE}" .
    docker image ls -l
    echo "Image removed"
  fi
fi