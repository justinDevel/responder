import logging


logger = logging.getLogger("Respondr")
logger.setLevel(logging.DEBUG)


console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)


formatter = logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)


if not logger.hasHandlers():
    logger.addHandler(console_handler)


def info(msg):
    logger.info(msg)

def debug(msg):
    logger.debug(msg)

def error(msg):
    logger.error(msg)

def warning(msg):
    logger.warning(msg)
