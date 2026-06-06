from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def check_plagiarism(new_text, existing_texts, threshold=0.8):
    """
    Compare new_text with existing_texts
    Returns similarity score + flag
    """

    if not existing_texts:
        return {"similarity": 0, "flag": False}

    try:
        corpus = existing_texts + [new_text]

        vectorizer = TfidfVectorizer().fit_transform(corpus)
        vectors = vectorizer.toarray()

        similarity_matrix = cosine_similarity(vectors)

        # Compare last text with all previous
        similarities = similarity_matrix[-1][:-1]

        max_similarity = max(similarities)

        return {
            "similarity": round(float(max_similarity), 2),
            "flag": max_similarity > threshold
        }

    except Exception as e:
        return {
            "similarity": 0,
            "flag": False,
            "error": str(e)
        }